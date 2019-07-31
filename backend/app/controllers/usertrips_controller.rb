class UsertripsController < ApplicationController
    def create
        trip = Trip.find(params[:trip_id])
        new_user = User.find(params[:user_id])
        if Usertrip.find_by(usertrip_params)
            render json: {error: "YOU CAN'T JOIN"}, status: 401
        else
            # client = Twilio::REST::Client.new Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token

            # client.messages.create from: '+14752243879', to: "+1#{new_user.phone}", body: "You just joined a trip to #{trip.destination}!"

            # trip.users.each do |user|
            #     client.messages.create from: '+14752243879', to: "+1#{user.phone}", body: "#{new_user.full_name} just joined your trip to #{trip.destination}!"
            # end

            usertrip = Usertrip.create(usertrip_params)
            render json: usertrip, include: {trip: {only: :users}}
            UserMailer.with(new_user: new_user, trip: trip).join_email.deliver_later
        end
    end

    def destroy
        usertrip = Usertrip.find(params[:id])
        trip = usertrip.trip
        unjoined_user = usertrip.user
        usertrip.destroy
        
        # client = Twilio::REST::Client.new Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token

        # client.messages.create from: '+14752243879', to: "+1#{unjoined_user.phone}", body: "You just unjoined a trip to #{trip.destination}"

        # trip.users.each do |user|
        #     client.messages.create from: '+14752243879', to: "+1#{user.phone}", body: "#{unjoined_user.full_name} just unjoined your trip to #{trip.destination}"
        # end
        UserMailer.with(unjoined_user: unjoined_user, trip: trip).unjoin_user_email.deliver_later
        UserMailer.with(unjoined_user: unjoined_user, trip: trip).unjoin_notification_email.deliver_later
    end
 
    private

    def usertrip_params
        params.permit(:user_id, :trip_id)
    end
end
