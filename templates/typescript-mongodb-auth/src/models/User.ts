import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//attributes that are required to make a new User
export interface UserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//interface that describes properties that a User DOCUMENT(instance) has
export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  resetToken?: string;
  resetExpires?: Date;
  active: boolean;
  //method that checks if password changed after sending JWT(user logged in)
  changedPasswordAfter(JWTTimestamp: number): boolean;
  //method that makes reset token hashes it pin it on a user document then returns not hashed version
  createPasswordResetToken(): string;
}

//interface to describe a properties that User Model(class) has
interface UserModel extends mongoose.Model<UserDocument /* */> {
  //static method for building new users
  build(attrs: UserAttributes): UserDocument;
  //static method to check if password and passwordConfirm are the same
  validatePasswordAndPasswordConfirm(pass: string, passConf: string): boolean;
  //check if password provided matches with user password
  correctPassword(
    providedPass: string,
    userPassword: UserDocument['password']
  ): Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'must provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'must provide a password'],
    minlength: 6,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetExpires: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

//================================================================================================

userSchema.statics.validatePasswordAndPasswordConfirm = (
  pass: string,
  passConf: string
) => {
  return pass === passConf;
};

//================================================================================================

/* 
This is static method used for creating User, so TS can be aware of arguments
we can and we need to provide for User document to be made.
This will return only a query, still need to await a save 
*/
userSchema.statics.build = (UserAttributes: UserAttributes) => {
  return new User(UserAttributes);

  /*
    how to use

    const newUser = User.build({
      name: 'name',
      email: email@valid.com,
      password: 'password'
    })

    await newUser.save()
  */
};
userSchema.pre<UserDocument>('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//================================================================================================

//check if pass match one in database
//method on document
userSchema.statics.correctPassword = async function (
  candidatePassword: string,
  userPassword: UserDocument['password']
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//================================================================================================

//check if users password changed at is before or after JWTTimestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//================================================================================================

//check if users password changed at is before or after JWTTimestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//================================================================================================

//creates token for password reset
//hashes password token and set it to user object
//creates rasswordResetExpires on user and set it to NOW + 10min
//returns token for password reset
userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
