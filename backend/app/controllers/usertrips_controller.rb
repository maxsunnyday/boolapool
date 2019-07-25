class UsertripsController < ApplicationController
    def create
        trip = Trip.find_by(params[:trip_id])
        if Usertrip.find_by(usertrip_params)
            render json: {error: "YOU CAN'T JOIN"}, status: 401
        else
            usertrip = Usertrip.create(usertrip_params)
            render json: usertrip, include: {trip: {only: :users}}
        end
    end
 
    private

    def usertrip_params
        params.permit(:user_id, :trip_id)
    end
end
