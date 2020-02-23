import "reflect-metadata";
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";

createConnection({
  type: "sqlite",
  database: "db.sqlite3",
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
  logging: true
})
  .then(async connection => {
    // create photo object
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.views = 1;
    photo.filename = "photo-with-bears.jpg";
    photo.isPublished = true;

    // create photo metadata object
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = "cybershoot";
    metadata.orientation = "portait";

    photo.metadata = metadata; // this way we connect them

    // get repository
    let photoRepository = connection.getRepository(Photo);

    // saving a photo also save the metadata
    await photoRepository.save(photo);

    console.log("Photo is saved, photo metadata is saved too.");

    let photos = await connection
      .getRepository(Photo)
      .createQueryBuilder("photo")
      .innerJoinAndSelect("photo.metadata", "metadata")
      .getMany();

    console.log(photos);
  })
  .catch(error => console.log(error));
