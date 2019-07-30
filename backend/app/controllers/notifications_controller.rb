class NotificationsController < ApplicationController

    # skip_before_action :verify_authenticity_token
  
    def notify
        client = Twilio::REST::Client.new Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token

        message = client.messages.create from: '+14752243879', to: '+15412063420', body: 'Wassup'
        # , status_callback: request.base_url + '/twilio/status'

        render plain: message.status
    end
  
end