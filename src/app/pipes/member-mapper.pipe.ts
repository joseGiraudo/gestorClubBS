import { PipeTransform } from "@angular/core";
import { Member } from "../models/member";


export class MemberMapperPipe implements PipeTransform {
    transform(value: any, ...args: any[]): Member {
        
        return {
            id: value.id,
            name: value.name,
            lastName: value.last_name,
            dni: value.dni,
            email: value.email,
            phone: value.phone,
            address: value.address,
            birthdate: value.birthdate,
            createdAt: value.created_at,
            isActive: value.is_active,
            type: value.type,
        }
    }

    inverttrasnform(value: any, ...args: any[]): any {
        
        return {
            id: value.id,
            name: value.name,
            last_name: value.last_name,
            dni: value.dni,
            email: value.email,
            phone: value.phone,
            address: value.address,
            birthdate: value.birthdate,
            created_at: value.createdAt,
            is_active: value.isActive,
            type: value.type,
        }
    }
}