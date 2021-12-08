class CreateTmpCharacters < ActiveRecord::Migration[5.2]
  def change
    create_table :tmp_characters do |t|
      t.text :json_data

      t.timestamps
    end
  end
end
