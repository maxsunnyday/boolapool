# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Trip.destroy_all
User.destroy_all
Usertrip.destroy_all


user1 = User.create(first_name: "Xavier", last_name: "Ruiz", email: "xavier.ruiz@yale.edu", phone: "1234567890")
trip1 = Trip.create(destination: "LGA", address: "123 Street", capacity: 3)
usertrip1 = Usertrip.create(user_id: 1, trip_id: 1)