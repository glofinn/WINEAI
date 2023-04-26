from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db, app

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
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
        if (key == 'name'):
            if not user:
                raise ValueError('Name must not be empty')
            elif user == int:
                raise ValueError('Name can not be a number')
            return user

            

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))


class WineLabel(db.Model, SerializerMixin):
    __tablename__ = 'winelabels'

    id = db.Column(db.Integer, primary_key=True)
    generatedimg = db.Column(db.String, nullable = False)
    style = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship("User", backpopulates="labels")



class Wine(db.Model, SerializerMixin):
    __tablename__ = 'wines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, )
    type = db.Column(db.String, )
    grapes = db.Column(db.String,)
    region = db.Column(db.String)
    country = db.Column(db.String)
    story = db.Column(db.String)
    label_id = db.Column(db.Integer, db.ForeignKey('winelabels.id'))
    user_id = db.Coluymn(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship("User", back_populates="wines")

    @validates('type', 'grapes', 'region', 'country')
    def validate_wine(self, key, wine):
        if (key == 'type'):
            if not wine:
                raise ValueError('Type cannot be blank')
            elif wine != 'Red' or 'White' or 'Orange' or 'Petnat':
                raise ValueError("Type must be either 'Red', 'White', 'Orange' or 'Petnat'")
        if (key == 'grapes'):
            if not wine:
                raise ValueError('Grapes cannot be blank')
            elif wine == int:
                raise ValueError('Grapes cant be a number')
        if (key == 'region'):
            if not wine:
                raise ValueError('Region cannot be blank')
            elif wine == int:
                raise ValueError('Region cant be a number')
        if (key == 'country'):
            if not wine:
                raise ValueError('Country cannot be blank')
            elif wine == int:
                raise ValueError('Country cant be a number')
        
            
        


# class Stories(db.Model, SerializerMixin):
#     __tablename__ = 'stories'

#     id = db.Column(db.Integer, primary_key=True)
#     wine = db.Column(db.Integer, db.ForeignKey('wines.id'))
#     story = db.Column(db.String)


    

