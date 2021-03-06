class UserMailer < ApplicationMailer
    default from: 'mrmscvfunrun@gmail.com'
    
    def welcome_email
        @user = params[:user]
        @url  = 'https://boolapool.surge.sh'
        mail(to: @user.email, subject: 'Welcome to BoolaPool!')
    end

    def new_trip_email
        @user = params[:user]
        @trip = params[:trip]
        @url  = 'https://boolapool.surge.sh'
        mail(to: @user.email, subject: 'You Just Created a New Trip Request!')
    end

    def join_email
        @new_user = params[:new_user]
        @trip = params[:trip]
        @url = 'https://boolapool.surge.sh'
        mail(to: @trip.user_emails, subject: "#{@new_user.first_name} just joined the trip from #{@trip.origin} to #{@trip.destination}!")
    end

    def unjoin_user_email
        @unjoined_user = params[:unjoined_user]
        @trip = params[:trip]
        @url = 'https://boolapool.surge.sh'
        mail(to: @unjoined_user.email, subject: "You just unjoined the trip from #{@trip.origin} to #{@trip.destination}")
    end

    def unjoin_notification_email
        @unjoined_user = params[:unjoined_user]
        @trip = params[:trip]
        @url = 'https://boolapool.surge.sh'
        mail(to: @trip.user_emails, subject: "#{@unjoined_user.first_name} just unjoined the trip from #{@trip.origin} to #{@trip.destination}")
    end
end
