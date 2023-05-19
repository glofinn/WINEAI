from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db, app

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-wines', '-labels')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    name = db.Column(db.String,)
    _password_hash = db.Column(db.String)

    # winelabels = db.Column(db.Integer, db.ForeignKey('winelabels.id'))
    

    wines = db.relationship("Wine", back_populates="user")
    labels = db.relationship("WineLabel", back_populates="user")

    @validates('username', 'name')
    def validate_user(self, key, user):
        users = db.session.query(User.username).all()
        if (key == 'username'):
            if not user:
                raise ValueError('Username must not be empty')
            elif user in users:
                raise ValueError('Username already in use')
            return user
        if (key == 'name'):
            if not user:
                raise ValueError('Name must not be empty')
            elif not isinstance(user, str):
                raise ValueError('Name must be a string')
        return user
        

            

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password: str) -> bool:
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))


class WineLabel(db.Model, SerializerMixin):
    __tablename__ = 'winelabels'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String)
    style = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", back_populates="labels")



class Wine(db.Model, SerializerMixin):
    __tablename__ = 'wines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, )
    type = db.Column(db.String, )
    grapes = db.Column(db.String)
    region = db.Column(db.String)
    country = db.Column(db.String)
    story = db.Column(db.String)
    bottle = db.Column(db.String)
    vintage = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    label_id = db.Column(db.Integer, db.ForeignKey('winelabels.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship("User", back_populates="wines")

    @validates('type', 'grapes', 'region', 'country')
    def validate_wine(self, key, wine):
        if key == 'type':
            if not wine:
                raise ValueError('Type cannot be blank')
            elif wine.lower() not in ['red', 'white', 'orange', 'petnat']:
                raise ValueError("Type must be either 'Red', 'White', 'Orange' or 'Petnat'")
            return wine.lower().capitalize()
        elif key in ['grapes', 'region', 'country']:
            if not wine:
                raise ValueError(f'{key.capitalize()} cannot be blank')
            
            elif not isinstance(wine, str):
                raise ValueError(f'{key.capitalize()} cant be a number')
            return wine.lower().capitalize()
        
            
        
            
        


# class Stories(db.Model, SerializerMixin):
#     __tablename__ = 'stories'

#     id = db.Column(db.Integer, primary_key=True)
#     wine = db.Column(db.Integer, db.ForeignKey('wines.id'))
#     story = db.Column(db.String)


    

