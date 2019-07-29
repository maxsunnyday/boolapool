class Trip < ApplicationRecord
    has_many :usertrips
    has_many :users, through: :usertrips

    def user_emails
        self.users.map do |user|
            user.email
        end
    end
end
