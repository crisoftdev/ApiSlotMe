// src/home/home.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('home')
export class Home {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    campo1: string;

    @Column()
    campo2: string;

    // Agrega los campos que tenga tu tabla
}
