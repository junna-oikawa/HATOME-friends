class ScenesController < ApplicationController
  protect_from_forgery
  def index
    @scenes = Scene.all
  end

  def new
    @characters = Character.all
  end

  def animate
    @scene = TmpScene.last
  end

  def show
    id = params[:id]
    pre_id = id.to_i - 1
    next_id = id.to_i + 1
    @scene = Scene.find(params[:id])
    @scene.id == Scene.first.id ? @pre_scene = Scene.last : @pre_scene = Scene.find(pre_id)
    @scene.id == Scene.last.id ? @next_scene = Scene.first : @next_scene = Scene.find(next_id)
  end

  def create
    scene = Scene.new(scene_params)
    scene.save
    redirect_to scene_path(scene.id)
  end

  def create_tmp
    data = TmpScene.new(scene_params)
    data.save
    redirect_to scenes_animate_path
  end

  private
  def scene_params
    params.permit(:json_data)
  end
end
