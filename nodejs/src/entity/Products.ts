import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class Products extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number

    @Column()
    Name: string

    @Column()
    Description: string

    @Column()
    Price: number

    @Column()
    Quantity: number

}
