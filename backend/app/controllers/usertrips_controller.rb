class UsertripsController < ApplicationController
    def create
        trip = Trip.find(params[:trip_id])
        new_user = User.find(params[:user_id])
        if Usertrip.find_by(usertrip_params)
            render json: {error: "YOU CAN'T JOIN"}, status: 401
        else
            usertrip = Usertrip.create(usertrip_params)
            render json: usertrip, include: {trip: {only: :users}}
            UserMailer.with(new_user: new_user, trip: trip).join_email.deliver_later
        end
    end

    def destroy
        usertrip = Usertrip.find(params[:id])
        trip = usertrip.trip
        user = usertrip.user
        usertrip.destroy
        UserMailer.with(unjoined_user: user, trip: trip).unjoin_user_email.deliver_later
        UserMailer.with(unjoined_user: user, trip: trip).unjoin_notification_email.deliver_later
    end
 
    private

    def usertrip_params
        params.permit(:user_id, :trip_id)
    end
end
