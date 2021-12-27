class CharactersController < ApplicationController
  protect_from_forgery
  def new
  end

  def create_tmp_character
    data = TmpCharacter.new(character_params)
    data.save
    redirect_to characters_confirm_path
  end

  def confirm
    @data = TmpCharacter.last
  end

  def create_tmp_eyelet
    # data = TmpEyelet.new(character_params)
    # data.save
    # redirect_to characters_name_path
    character = Character.new(character_params)
    character.save
    redirect_to new_scene_path
  end

  def name
    @character = Character.new
    @character.json_data = TmpEyelet.last.json_data
  end

  def create
    # character = Character.new(character_name_params)
    # character.save
    # redirect_to new_scene_path
  end

  

  private
  def character_params
    params.permit(:json_data, :name)
  end

  def character_name_params
    params.require(:character).permit(:json_data, :name)
  end
end
