class TripsController < ApplicationController
    def index
        trips = Trip.all
        render json: trips, include: :users
    end

    def create
        trip = Trip.create(trip_params)
        Usertrip.create(user_id: params[:user_id], trip_id: trip.id)
        render json: trip, include: :users
    end

    def show
        trip = Trip.find(params[:id])
        render json: trip
    end

    def destroy
        Trip.destroy(params[:id])
    end

    private

    def trip_params
        params.permit(:destination, :address, :capacity, :start_time, :end_time)
    end
end
