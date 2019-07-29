class UserMailer < ApplicationMailer
    default from: 'mrmscvfunrun@gmail.com'
    
    def welcome_email
        @user = params[:user]
        @url  = 'http://boolapool.herokuapp.com/'
        mail(to: @user.email, subject: 'Welcome to BoolaPool!')
    end

    def new_trip_email
        @user = params[:user]
        @trip = params[:trip]
        @url  = 'http://boolapool.herokuapp.com/'
        mail(to: @user.email, subject: 'You Just Created a New Trip Request!')
    end

    def join_email
        @new_user = params[:new_user]
        @trip = params[:trip]
        @url = 'http://boolapool.herokuapp.com/'
        mail(to: @trip.user_emails, subject: "#{@new_user.first_name} just joined the trip to #{@trip.destination}!")
    end
end