Rails.application.routes.draw do
  resources :usertrips
  resources :trips
  resources :users
  post "/login", to: "users#login"
  post "/twilio/voice", to: "twilio#voice"
  post 'notifications/notify', to: 'notifications#notify'
  post 'twilio/status', to: 'twilio#status'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
