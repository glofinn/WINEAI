from flask import request, make_response, jsonify, session;
from flask_restful import Resource, Api
from models import db, User, WineLabel, Wine
from config import app, bcrypt

api = Api(app)

def checkSession():
    print(session.get("user_id"),"is the user id session")


class Signup(Resource):
    def get(self):
        user = user.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401
        
    def post(self):

        data = request.get_json()
        new_user = User(
                username = data['username'],
                name = data['name'],
                _password_hash = bcrypt.generate_password_hash(data['_password_hash']).decode('utf-8')
            )
    
        db.session.add(new_user)
        db.session.commit()

        return make_response(new_user.to_dict(), 200)
    
api.add_resource(Signup, '/signup')

class Login(Resource):
    def post(self):
        data = request.get_json()
        print("Received data:", data)
        username = data['username']
        user = User.query.filter(User.username == username).first()

        password = data['_password_hash']

        if not user:
            return {'error': 'Invalid username or password'}, 401

        if user.authenticate(password):
            session['user_id'] = user.id
            print(session.get('user_id'), " is the session data")
            return user.to_dict(), 200
        

api.add_resource(Login, '/login')

class CheckSession(Resource):
    def get(self):
        print(session.get('user_id'), "this is the session data")
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401
        
api.add_resource(CheckSession, '/check_session')


class Logout(Resource):
    def post(self):
        session['user_id'] = None
        return {'message': "204, No Content"}, 204
    
api.add_resource(Logout, '/logout')



# WINES BY USER

class Wines(Resource):
    def get(self):
        user_id = request.args.get("user_id", type=int)
        if user_id:
            wines = Wine.query.filter_by(user_id=user_id).all()
        else:

            wines = Wine.query.all()
        wine_dict = [wint.to_dict() for wint in wines]

        return make_response(
            wine_dict,
            200
        )
    def post(self):
        data = request.get_json()
        new_wine = Wine(
            name = data['name'],
            type = data['type'],
            grapes = data['grapes'],
            region = data['region'],
            country = data['country'],
            label_id = data['label_id'],
            user_id = data['user_id'],
        )

        db.session.add(new_wine)
        db.session.commit()
        return {'message': 'New wine created', 'wine': new_wine.to_dict()}, 201
        

api.add_resource(Wines, '/winecellar')


#WINESBYTYPE
class WinesByType(Resource):
    def get(self, type):
        wine = Wine.query.filter_by(type = type).all()
        return wine.to_dict(), 200
    
api.add_resource(WinesByType, '/')


#WINESBYGRAPE
class WinesByGrape(Resource):
    def get(self, grape):
        wine = Wine.query.filter_by(grape = grape).all()
        return wine.to_dict(), 200
    
api.add_resource(WinesByGrape, '/')


#WINESBYREGION
class WinesByRegion(Resource):
    def get(self, region):
        wine = Wine.query.filter_by(region=region).all()
        return wine.to_dict(), 200
    
api.add_resource(WinesByRegion, '/')

#WINESBYCOUNTRY
class WinesByCountry(Resource):
    def get(self, country):
        wine = Wine.query.filter_by(country=country).first()
        return wine.to_dict(), 200
    
api.add_resource(WinesByCountry, '/')

#WINESBYID
class WinesById(Resource):
    def get(self, id):
        wine = Wine.query.filter_by(id=id).first()
        return wine.to_dict(), 200
    
    def patch(self, id):
        if not session['user_id']:
            return {'error': 'Unauthorized'}, 401
        wine = Wine.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(wine, attr, data[attr])
        db.session.add(wine)
        db.session.commit()
        
        return make_response(wine.to_dict(), 202)
    
    def delete(self, id):
        if not session['user_id']:
            return {'error': 'Unauthorized'}, 401
        wine = Wine.query.filter_by(id=id).first()
        db.session.delete(wine)
        db.session.commit()

api.add_resource(WinesById, '/')

#LABELS
class Labels(Resource):
    def get(self):
        winelabels = WineLabel.query.all()
        label_dict = [label.to_dict() for label in winelabels]
        return make_response(
            label_dict,
            200
        )
    def post(self):
        data = request.get_json()
        imageUrls = data.get('imageUrls',[])
        style = data.get('style', '')
        user_id = data.get('user_id', None)

        if not user_id:
            return make_response(
                {"message": "User not found"}, 400
            )
        
        for image_url in imageUrls:
            new_label = WineLabel(
                image_url = image_url,
                style = style,
                user_id = user_id)
            db.session.add(new_label)

        db.session.commit()
        return make_response({
            "message": "Labels created successfully"
        }, 201)
     
        
    
api.add_resource(Labels, '/labels')

#LABELSBYSTYLE
class LabelsByStyle(Resource):
    def get(self, style):
        label = WineLabel.query.filter_by(style=style).first()
        return label.to_dict(), 200

api.add_resource(LabelsByStyle, '/labels')

#LABELSBYUSER
class LabelsByUser(Resource):
    def get(self, user):
        labels = WineLabel.query.filter_by(user_id=user).order_by(WineLabel.created_at.desc()).limit(4).all()
        label_dict = [label.to_dict() for label in labels]
        return make_response(
            {'labels': label_dict}, 
            200
        )
    
api.add_resource(LabelsByUser, '/labels/user/<int:user>')

#LABELSBYID
class LabelsById(Resource):
    def get(self, id):
        label = WineLabel.query.filter_by(id=id).first()
        return label.to_dict(), 200
    
api.add_resource(LabelsById, '/')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

    







