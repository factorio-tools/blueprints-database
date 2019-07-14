import { InputType, Field } from 'type-graphql'
import { IsEmail } from 'class-validator/decorator/string/IsEmail'
import { Length } from 'class-validator/decorator/string/Length'
import { IsNotEmpty } from 'class-validator/decorator/common/IsNotEmpty'
import { ValidateIf } from 'class-validator/decorator/system/ValidateIf'
import { Matches } from 'class-validator/decorator/string/Matches'
import { User } from './user'
import { EqualsField } from './validationDecorators'

@InputType()
class RegisterInput implements Partial<User> {
    @Field()
    @Length(2, 25)
    @Matches(/^[a-zA-Z0-9._-]+$/, {
        message:
            'username must contain only letters, numbers and the following symbols: . (dot), _ (underscore) or - (dash)'
    })
    public username!: string

    @Field()
    @Length(5, 25)
    public password!: string

    @Field()
    @EqualsField('password', { message: 'passwords do not match' })
    public confirmPassword!: string

    @Field()
    @IsEmail(undefined, { message: 'email is invalid' })
    public email!: string
}

@InputType()
class RegisterWithSteamInput implements Partial<User> {
    @Field()
    @Length(2, 25)
    @Matches(/^[a-zA-Z0-9._-]+$/, {
        message:
            'username must contain only letters, numbers and the following symbols: . (dot), _ (underscore) or - (dash)'
    })
    public username!: string

    @Field({ nullable: true })
    @ValidateIf(o => o.email !== '' && o.email !== undefined && o.email !== null)
    @IsEmail()
    public email?: string
}

@InputType()
class LoginInput implements Partial<User> {
    @Field()
    @IsNotEmpty()
    public username!: string

    @Field()
    @IsNotEmpty()
    public password!: string
}

export { RegisterInput, RegisterWithSteamInput, LoginInput }
