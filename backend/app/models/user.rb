class User < ApplicationRecord
    has_many :usertrips
    has_many :trips, through: :usertrips
end
