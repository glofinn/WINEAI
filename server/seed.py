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
    
    finn = User(username="glofinn", name="Finn")
    finn.password_hash = "123"
    nick = User(username="nick", name="Nick")
    nick.password_hash = "123"
    users = [finn, nick]


    print("Creating Wines...")
    wine1 = Wine(name="Mira Mira", type="Red", grapes="Bobal", region="Bonastre", country="Spain", story="blabla",bottle="/static/images/wine1.png", vintage=2020, label_id=1, user_id=3)
    wine2 = Wine(name="Marto", type="White", grapes="Riesling", region="Rheinhessen", country="Germany", story="blabla", bottle="/static/images/wine2.png",vintage=2020, label_id=2, user_id=4)
    wine3 = Wine(name="Ace of Spades", type="Red", grapes="Mourvedre", region="Languedoc-Roussillon", country="France", story="blabla", bottle="/static/images/wine3.png",vintage=2020, label_id=3, user_id=3)
    wine4 = Wine(name="Controvento", type="Red", grapes="Trebbiano/Passerina/Montepulciano", region="Abruzzo", country="Italy", story="blabla",bottle="/static/images/wine4.png",vintage=2020, label_id=4, user_id=3)
    wine5 = Wine(name="Alto Mare", type="White", grapes="Trebbian/Malvasia di Candia/Passerina/Fiano", region="Abruzzo", country="Italy", story="blabla",bottle="/static/images/wine5.png",vintage=2020, label_id=5, user_id=3)
    wine6 = Wine(name="Vivanterre", type="Orange", grapes="Gewürztraminer/Grenache Gris/Pinot Auxerrois/Pinot Blanc/Ugni Blanc", region="Auvergne", country="France", story="blabla",bottle="/static/images/wine6.png", vintage=2020,label_id=5, user_id=3)
    wine7 = Wine(name="Ergastoline", type="White", grapes="Roussanne", region="Savoie", country="France", story="blabla",bottle="/static/images/wine7.png",vintage=2020, label_id=5, user_id=3)
    wine8 = Wine(name="Eriu", type="Red", grapes="Syrah/Mourvedre", region="Oregon", country="USA", story="blabla",bottle="/static/images/wine8.png",vintage=2020, label_id=5, user_id=3)
    wine9 = Wine(name="Superbloom", type="Orange", grapes="Mourvedre/Roussanne/Picpoul Blanc/Grenache Blanc/Grenache Noir", region="California", country="USA", story="blabla",bottle="/static/images/wine9.png", vintage=2020,label_id=5, user_id=3)
    wine10 = Wine(name="Scotty Boy El Sandweeech!!", type="Red", grapes="Chardonnay/Pinot Noir", region="California", country="USA", story="blabla",bottle="/static/images/wine10.png", vintage=2020,label_id=5, user_id=3)
    wine11 = Wine(name="Glou Glou", type="Red", grapes="Carignan/Charbono/Zinfandel Valdiguie", region="California", country="USA", story="blabla",bottle="/static/images/wine11.png",vintage=2020, label_id=5, user_id=3)
    wine12 = Wine(name="Big Tang", type="Red", grapes="Syrah", region="California", country="USA", story="blabla",bottle="/static/images/wine12.png", vintage=2020,label_id=5, user_id=3)
    wine13 = Wine(name="Mol", type="Red", grapes="Merlot/Grenache/Syrah/Carignan/Gamay/Sauvignon Blanc", region="Auvergne", country="France", story="blabla",bottle="/static/images/wine13.png", vintage=2019,label_id=5, user_id=3)
    wine14 = Wine(name="La Russe Rouge", type="Red", grapes="Syrah", region="Languedoc-Roussillon", country="France", story="blabla",bottle="/static/images/wine16.png", vintage=2022,label_id=5, user_id=3)
    wine15 = Wine(name="Gorbachev", type="Red", grapes="Soviet", region="St-Petersburg", country="Russia", story="blabla",bottle="/static/images/wine17.png", vintage=1990,label_id=5, user_id=3)
    wine16 = Wine(name="Great Famine", type="Red", grapes="Gamay", region="Vladivostok", country="Russia", story="blabla",bottle="/static/images/wine18.png", vintage=1989,label_id=5, user_id=3)



    wines = [wine1, wine2, wine3, wine4, wine5, wine6, wine7, wine8, wine10,wine11,wine12,wine13,wine14, wine15, wine16]

    print("Creating labels...")
    label1 = WineLabel(image_url="../WINESRCS/wine1.png", style="Expressionist", user_id=1)
    label2 = WineLabel(image_url="../WINESRCS/wine2.png", style="Expressionist", user_id=1)
    label3 = WineLabel(image_url="../WINESRCS/wine3.png", style="Expressionist", user_id=1)
    label4 = WineLabel(image_url="../WINESRCS/wine4.png", style="Expressionist", user_id=1)
    label5 = WineLabel(image_url="../WINESRCS/wine5.png", style="Expressionist", user_id=1)

    labels = [label1, label2, label3, label4, label5]


    db.session.add_all(users)
    db.session.add_all(wines)
    db.session.add_all(labels)
    db.session.commit()

    print("Seeding done!")
