class AddTextsToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :texts, :boolean
  end
end
