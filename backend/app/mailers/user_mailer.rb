class UserMailer < ApplicationMailer
    default from: 'team@boolapool.herokuapp.com'
    
    def welcome_email
        @user = params[:user]
        @url  = 'http://boolapool.herokuapp.com/'
        mail(to: @user.email, subject: 'Welcome to BoolaPool!')
    end
end
