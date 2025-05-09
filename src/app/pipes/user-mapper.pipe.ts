import { PipeTransform } from "@angular/core";
import { Member } from "../models/member";
import { User } from "../models/user";


export class UserMapperPipe implements PipeTransform {
    transform(value: any, ...args: any[]): User {
        
        return {
            id: value.id,
            name: value.name,
            lastName: value.last_name,
            email: value.email,
            password: value.password,
            role: value.role,
            isActive: value.is_active
        }
    }

    invertTrasnform(value: any, ...args: any[]): any {
        
        return {
            id: value.id,
            name: value.name,
            last_name: value.lastName,
            email: value.email,
            password: value.password,
            role: value.role,
            is_active: value.isActive,
        }
    }
}