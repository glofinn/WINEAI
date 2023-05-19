from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_cors import CORS

metadata = MetaData(naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})


db = SQLAlchemy(metadata=metadata)

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, origins=['http://localhost:4000'])

app.config['SECRET_KEY']='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'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)