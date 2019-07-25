class UsersController < ApplicationController
    def login
        user = User.find_by(email: params[:email])
        if user
            render json: user
        else
            render json: {error: "YOU CAN'T LOG IN"}, status: 401
        end
    end

    def index
        users = User.all
        render json: users, include: :trips
    end

    def create
        user = User.create(user_params)
        render json: user
    end

    def show
        user = User.find(params[:id])
        render json: user, include: {trips: {include: :users}}
    end

    private

    def user_params
        params.permit(:first_name, :last_name, :email, :phone)
    end
end
