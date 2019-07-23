class TripsController < ApplicationController
    def index
        trips = Trip.all
        render json: trips, include: :users
    end

    def create
        trip = Trip.create(trip_params)
        render json: trip, include: :users
    end

    def show
        trip = Trip.find(params[:id])
        render json: trip
    end

    private

    def trip_params
        params.permit(:destination, :address, :capacity, :start_time, :end_time)
    end
end
