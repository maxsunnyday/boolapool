# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Usertrip.destroy_all
Trip.destroy_all
User.destroy_all


user1 = User.create(first_name: "Xavier", last_name: "Ruiz", email: "xavier.ruiz@yale.edu", phone: "2819790004", texts: true, password: "deedeemegadoodoo")
user2 = User.create(first_name: "Max", last_name: "Sun", email: "max.sun@yale.edu", phone: "5412063420", texts: true, password: "maxsun")