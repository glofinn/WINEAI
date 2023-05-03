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
    wine1 = Wine(name="Mira Mira", type="Red", grapes="Bobal", region="Bonastre", country="Spain", story="blabla",bottle="https://cdn.shopify.com/s/files/1/0526/5352/3105/products/SIPS_1024_PRODUCTS-42.jpg?v=1679678892&width=1100", vintage=2020, label_id=1, user_id=4)
    wine2 = Wine(name="Marto", type="White", grapes="Riesling", region="Rheinhessen", country="Germany", story="blabla", bottle="https://cdn.shopify.com/s/files/1/0526/5352/3105/products/SIPS_1024_PRODUCTS-26.jpg?v=1679678461&width=1100",vintage=2020, label_id=2, user_id=4)
    wine3 = Wine(name="Ace of Spades", type="Red", grapes="Mourvedre", region="Languedoc-Roussillon", country="France", story="blabla", bottle="https://www.grape-times.com/wp-content/uploads/matassa_03_ace_of_spades_2019_grapetimes_1980-scaled.jpg",vintage=2020, label_id=3, user_id=3)
    wine4 = Wine(name="Controvento", type="Red", grapes="Trebbiano/Passerina/Montepulciano", region="Abruzzo", country="Italy", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/ControventoOndaAnomalaRosato2020_1800x1800.jpg?v=1629227571",vintage=2020, label_id=4, user_id=3)
    wine5 = Wine(name="Alto Mare", type="White", grapes="Trebbian/Malvasia di Candia/Passerina/Fiano", region="Abruzzo", country="Italy", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/ControventoAltoMareVinoBianco2020_1800x1800.jpg?v=1629227925",vintage=2020, label_id=5, user_id=3)
    wine6 = Wine(name="Vivanterre", type="Orange", grapes="Gewürztraminer/Grenache Gris/Pinot Auxerrois/Pinot Blanc/Ugni Blanc", region="Auvergne", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/VivanterreContactSGS2020_1800x1800.jpg?v=1627406193", vintage=2020,label_id=5, user_id=3)
    wine7 = Wine(name="Ergastoline", type="White", grapes="Roussanne", region="Savoie", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/DomaineLaBoheme_PatrickBouju_ErgastolineVDFWhite2020_Retouched_1800x1800.jpg?v=1676306355",vintage=2020, label_id=5, user_id=3)
    wine8 = Wine(name="Eriu", type="Red", grapes="Syrah/Mourvedre", region="Oregon", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/HiyuEriucopy_1800x1800.jpg?v=1669685931",vintage=2020, label_id=5, user_id=3)
    wine9 = Wine(name="Superbloom", type="Orange", grapes="Mourvedre/Roussanne/Picpoul Blanc/Grenache Blanc/Grenache Noir", region="California", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/LasJarasSuperbloom2020_1800x1800.jpg?v=1620769619", vintage=2020,label_id=5, user_id=3)
    wine10 = Wine(name="Scotty Boy El Sandweeech!!", type="Red", grapes="Chardonnay/Pinot Noir", region="California", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/ScottyBoy_ElSandweech_2020_1800x1800.jpg?v=1624387394", vintage=2020,label_id=5, user_id=3)
    wine11 = Wine(name="Glou Glou", type="Red", grapes="Carignan/Charbono/Zinfandel Valdiguie", region="California", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/s960139647518080127_p5042_i1_w2959_1800x1800.jpg?v=1619808881",vintage=2020, label_id=5, user_id=3)
    wine12 = Wine(name="Big Tang", type="Red", grapes="Syrah", region="California", country="USA", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/s960139647518080127_p2925_i3_w3024_1800x1800.jpg?v=1619025879", vintage=2020,label_id=5, user_id=3)
    wine13 = Wine(name="Mol", type="Red", grapes="Merlot/Grenache/Syrah/Carignan/Gamay/Sauvignon Blanc", region="Auvergne", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/DomaineLaBohemeMol2019_1800x1800.jpg?v=1631051216", vintage=2019,label_id=5, user_id=3)
    wine14 = Wine(name="Les Foulards Rouges", type="Red", grapes="Syrah, Grenache Noir", region="Languedoc-Roussillon", country="France", story="blabla",bottle="https://winetherapynyc.com/cdn/shop/products/LesFoulardsRougesOctobre2021_1800x1800.jpg?v=1642607387", vintage=2022,label_id=5, user_id=3)



    wines = [wine1, wine2, wine3, wine4, wine5, wine6, wine7, wine8, wine10,wine11,wine12,wine13,wine14]

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
