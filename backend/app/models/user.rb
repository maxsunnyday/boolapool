class User < ApplicationRecord
    has_many :usertrips
    has_many :trips, through: :usertrips
    validates :email, uniqueness: true
    has_secure_password
end
