class User < ApplicationRecord
    has_many :usertrips
    has_many :trips, through: :usertrips
    validates :email, uniqueness: true
    has_secure_password

    def full_name
        "#{self.first_name} #{self.last_name}"
    end
end
