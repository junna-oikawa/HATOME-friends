Rails.application.routes.draw do
  # get 'homes/top'
  # get 'scenes/index'
  # get 'scenes/new'
  # 
  # get 'scenes/show'
  # get 'charactors/new'
  # get 'charactors/confirm'
  # get 'charactors/name'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: "homes#top"
  # resources :practices, :only => [:create, :show]
  post 'scenes/create_tmp'
  get 'scenes/animate'
  resources :scenes, :only => [:index, :new, :show, :create]
  get 'characters/confirm'
  get 'characters/name'
  post 'characters/create_tmp_character'
  post 'characters/create_tmp_eyelet'
  resources :characters, :only => [:new, :create]

end
