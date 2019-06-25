import { registerDecorator } from 'class-validator/register-decorator'
import { ValidatorConstraint } from 'class-validator/decorator/ValidatorConstraint'
import { ValidationOptions } from 'class-validator/decorator/ValidationOptions'
import { ValidationArguments } from 'class-validator/validation/ValidationArguments'
import { ValidatorConstraintInterface } from 'class-validator/validation/ValidatorConstraintInterface'

function EqualsField(property: string, validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: EqualsFieldConstraint
        })
    }
}

@ValidatorConstraint({ name: 'equalsField' })
class EqualsFieldConstraint implements ValidatorConstraintInterface {
    public validate(value: unknown, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints
        const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName]
        return value === relatedValue
    }
}

export { EqualsField }
