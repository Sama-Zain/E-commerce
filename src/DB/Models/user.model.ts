import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { genderEnum, providerEnum, roleEnum } from 'src/common/enums/usersEnum';
import { hash } from 'src/common/Security/hash.security';

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    maxlength: [30, 'Firstname should not be more than 30 characters'],
    minlength: [3, 'Firstname should not be less than 3 characters'],
    trim: true,
  })
  firstname!: string; //! for indicating that this property will be definitely assigned a value, even if it is not initialized in the constructor. This is useful in scenarios where the property will be set later, such as when using decorators like @Prop in NestJS with Mongoose.

  @Prop({
    type: String,
    required: true,
    maxlength: [30, 'Lastname should not be more than 30 characters'],
    minlength: [3, 'Lastname should not be less than 3 characters'],
    trim: true,
  })
  lastname!: string;

  username!: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: Date,
  })
  confirmEmail!: Date;

  @Prop({
    type: String,
    default: undefined,
  })
  confirmEmailOTP: string | undefined;

  @Prop({
    type: String,
    required: function (this: any) {
      return this.provider === providerEnum.GOOGLE ? false : true;
    },
  })
  password!: string;

  @Prop({
    type: Date,
    default: undefined,
  })
  OTPExpires!: Date | undefined;

  @Prop({
    type: String,
    enum: {
      values: Object.values(genderEnum),
      default: genderEnum.MALE,
    },
  })
  gender!: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(providerEnum),
      default: providerEnum.SYSTEM,
    },
  })
  provider!: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(roleEnum),
      default: roleEnum.USER,
    },
  })
  role!: string;

  @Prop({
    type: String,
  })
  profilePic!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
});

UserSchema.virtual('username')
  .get(function (this: any) {
    return this.firstname + ' ' + this.lastname;
  })
  .set(function (this: any, value: string) {
    const [firstname, lastname] = value.split(' ') || [];
    this.firstname = firstname;
    this.lastname = lastname;
  });
export type HUserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
