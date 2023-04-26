from random import choice as rc
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import app
from models import db, User, Wine, WineLabel

with app.app_context():

    print("Deleting data...")
    User.query.delete()
    Wine.query.delete()
    WineLabel.query.delete()


    print("Creating User...")
    finn = User(username="glofinn", name="Finn", _password_hash="123")
    nick = User(username="nick", name="Nick", _password_hash="123")

    users = [finn, nick]


    print("Creating Wines...")
    wine1 = Wine(name="Mira Mira", type="Red", grapes="Bobal", region="Bonastre", country="Spain", story="blabla", label=1, user=1)
    wine2 = Wine(name="Marto", type="White", grapes="Riesling", region="Rheinhessen", country="Germany", story="blabla", label=2, user=1)
    wine3 = Wine(name="Ace of Spades", type="Red", grapes="Mourvedre", region="Languedoc-Roussillon", country="France", story="blabla", label=3, user=1)
    wine4 = Wine(name="Controvento", type="Red", grapes="Trebbiano/Passerina/Montepulciano", region="Abruzzo", country="Italy", story="blabla", label=4, user=2)
    wine5 = Wine(name="Alto Mare", type="White", grapes="Trebbian/Malvasia di Candia/Passerina/Fiano", region="Abruzzo", country="Italy", story="blabla", label=5, user=2)

    wines = [wine1, wine2, wine3, wine4, wine5]

    print("Creating labels...")
    label1 = WineLabel(generatedimg="../WINESRCS/wine1.png", style="Expressionist", user=1)
    label2 = WineLabel(generatedimg="../WINESRCS/wine2.png", style="Expressionist", user=1)
    label3 = WineLabel(generatedimg="../WINESRCS/wine3.png", style="Expressionist", user=1)
    label4 = WineLabel(generatedimg="../WINESRCS/wine4.png", style="Expressionist", user=1)
    label5 = WineLabel(generatedimg="../WINESRCS/wine5.png", style="Expressionist", user=1)

    labels = [label1, label2, label3, label4, label5]


    db.session.add_all(users)
    db.session.add_all(wines)
    db.session.add_all(labels)
    db.session.commit()

    print("Seeding done!")
