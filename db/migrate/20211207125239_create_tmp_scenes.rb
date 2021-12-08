class CreateTmpScenes < ActiveRecord::Migration[5.2]
  def change
    create_table :tmp_scenes do |t|
      t.text :json_data

      t.timestamps
    end
  end
end
