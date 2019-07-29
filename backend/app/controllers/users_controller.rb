class UsersController < ApplicationController
    def login
        user = User.find_by(email: params[:email])
        if user && user.authenticate(params[:password])
            render json: user
        else
            render json: {error: "INVALID EMAIL AND/OR PASSWORD"}, status: 401
        end
    end

    def index
        users = User.all
        render json: users, include: :trips
    end

    def create
        user = User.create(user_params)
        if user.valid?
            render json: user
            UserMailer.with(user: user).welcome_email.deliver_now
        else
            render json: {errors: user.errors.full_messages}, status: 406
        end
    end

    def show
        user = User.find(params[:id])
        render json: user, include: [{trips: {include: [:users, :usertrips]}}]
    end

    private

    def user_params
        params.permit(:first_name, :last_name, :email, :phone, :password, :password_confirmation)
    end
end
