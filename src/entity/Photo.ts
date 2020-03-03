import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";
import faker from "faker";

@Entity()
export class Photo {
  public static fake(entity?: Photo) {
    const photo = new Photo();

    photo.id = entity?.id || undefined;
    photo.name = entity?.name || faker.name.findName();
    photo.description = entity?.description || faker.lorem.paragraph();
    photo.filename = entity?.filename || faker.system.fileName();
    photo.isPublished = entity?.isPublished || faker.random.boolean();
    photo.metadata = entity?.metadata || undefined;
    photo.views = entity?.views || faker.random.number({ min: 1 });

    return photo;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    length: 100
  })
  name?: string;

  @Column("text")
  description?: string;

  @Column()
  filename?: string;

  @Column("double")
  views?: number;

  @Column()
  isPublished?: boolean;

  @OneToOne(
    () => PhotoMetadata,
    (photoMetadata: PhotoMetadata) => photoMetadata.photo,
    {
      cascade: true
    }
  )
  metadata?: PhotoMetadata;
}
