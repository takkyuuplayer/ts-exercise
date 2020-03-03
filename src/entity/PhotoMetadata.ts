import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import { Photo } from "./Photo";
import faker from "faker";

@Entity()
export class PhotoMetadata {
  public static fake(entity?: PhotoMetadata) {
    const photoMetadata = new PhotoMetadata();

    photoMetadata.id = entity?.id || undefined;
    photoMetadata.comment = entity?.comment || faker.lorem.paragraphs();
    photoMetadata.compressed = entity?.compressed || faker.random.boolean();
    photoMetadata.height =
      entity?.height || faker.random.number({ min: 480, max: 1024 });
    photoMetadata.orientation =
      entity?.orientation ||
      faker.random.arrayElement(["PORTRATE", "SELFEE", "LANDSCAPE"]);
    photoMetadata.photo = entity?.photo || undefined;
    photoMetadata.width =
      entity?.width || faker.random.number({ min: 480, max: 1024 });

    return photoMetadata;
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("int")
  height?: number;

  @Column("int")
  width?: number;

  @Column()
  orientation?: string;

  @Column()
  compressed?: boolean;

  @Column()
  comment?: string;

  @OneToOne(
    () => Photo,
    (photo: Photo) => photo.metadata
  )
  @JoinColumn()
  photo?: Photo;
}
