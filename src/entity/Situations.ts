import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { User } from "./Users";

@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameSituation!: string;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => User, (user) => user.situation)
    users!: User[]
}