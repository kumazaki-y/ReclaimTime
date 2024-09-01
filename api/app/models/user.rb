class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  # ユーザーがログイン認証しているかを判定
  def token_validation_response
    as_json(except: %i[tokens created_at updated_at]).merge(confirmed_at: self.confirmed_at)
  end
end