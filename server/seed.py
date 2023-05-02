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
    wine1 = Wine(name="Mira Mira", type="Red", grapes="Bobal", region="Bonastre", country="Spain", story="blabla",bottle="https://cdn.shopify.com/s/files/1/0526/5352/3105/products/SIPS_1024_PRODUCTS-42.jpg?v=1679678892&width=1100", label_id=1, user_id=4)
    wine2 = Wine(name="Marto", type="White", grapes="Riesling", region="Rheinhessen", country="Germany", story="blabla", bottle="https://cdn.shopify.com/s/files/1/0526/5352/3105/products/SIPS_1024_PRODUCTS-26.jpg?v=1679678461&width=1100", label_id=2, user_id=4)
    wine3 = Wine(name="Ace of Spades", type="Red", grapes="Mourvedre", region="Languedoc-Roussillon", country="France", story="blabla", bottle="https://www.grape-times.com/wp-content/uploads/matassa_03_ace_of_spades_2019_grapetimes_1980-scaled.jpg", label_id=3, user_id=3)
    wine4 = Wine(name="Controvento", type="Red", grapes="Trebbiano/Passerina/Montepulciano", region="Abruzzo", country="Italy", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/ControventoOndaAnomalaRosato2020_1800x1800.jpg?v=1629227571", label_id=4, user_id=3)
    wine5 = Wine(name="Alto Mare", type="White", grapes="Trebbian/Malvasia di Candia/Passerina/Fiano", region="Abruzzo", country="Italy", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/ControventoAltoMareVinoBianco2020_1800x1800.jpg?v=1629227925", label_id=5, user_id=3)
    wine6 = Wine(name="Vivanterre", type="Orange", grapes="Gewürztraminer/Grenache Gris/Pinot Auxerrois/Pinot Blanc/Ugni Blanc", region="Auvergne", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/VivanterreContactSGS2020_1800x1800.jpg?v=1627406193", label_id=5, user_id=3)
    wine7 = Wine(name="Ergastoline", type="White", grapes="Roussanne", region="Savoie", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/DomaineLaBoheme_PatrickBouju_ErgastolineVDFWhite2020_Retouched_1800x1800.jpg?v=1676306355", label_id=5, user_id=3)
    wine8 = Wine(name="Eriu", type="Red", grapes="Syrah/Mourvedre", region="Oregon", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/HiyuEriucopy_1800x1800.jpg?v=1669685931", label_id=5, user_id=3)

    wines = [wine1, wine2, wine3, wine4, wine5, wine6, wine7, wine8]

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
