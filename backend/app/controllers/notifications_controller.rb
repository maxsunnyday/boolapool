class NotificationsController < ApplicationController

    skip_before_action :verify_authenticity_token
  
    def notify
        client = Twilio::REST::Client.new Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token

    end
  
end