import { faker } from "@faker-js/faker";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class PhotoMetadata {
  public static fake(entity?: PhotoMetadata) {
    const photoMetadata = new PhotoMetadata();

    photoMetadata.id = entity?.id || undefined;
    photoMetadata.comment = entity?.comment || faker.lorem.paragraphs();
    photoMetadata.compressed = entity?.compressed || faker.datatype.boolean();
    photoMetadata.height =
      entity?.height || faker.datatype.number({ min: 480, max: 1024 });
    photoMetadata.orientation =
      entity?.orientation ||
      faker.helpers.arrayElement(["PORTRATE", "SELFEE", "LANDSCAPE"]);
    photoMetadata.photo = entity?.photo || undefined;
    photoMetadata.width =
      entity?.width || faker.datatype.number({ min: 480, max: 1024 });

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
    (photo: Photo) => photo.metadata,
  )
  @JoinColumn()
  photo?: Photo;
}
