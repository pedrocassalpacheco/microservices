package org.cloudfoundry.samples.music.web.controllers;

import java.util.Properties;
import org.cloudfoundry.samples.music.domain.Album;
import org.cloudfoundry.samples.music.repositories.AlbumRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.log4j.BasicConfigurator;


@RestController
@RequestMapping(value = "/play")
public class PlayController {

    private static final Logger LOG = LoggerFactory.getLogger(PlayController.class);
    private final AlbumRepository repository;

    @Autowired
    public PlayController(AlbumRepository repository) {
        this.repository = repository;
        BasicConfigurator.configure();
        org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.INFO);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Album getById(@PathVariable String id) {
        LOG.info("Playing album " + id);
        Album album = repository.findOne(id);
        playAlbum(album);
        return album;
    }

    private void playAlbum(Album album) {
        Properties props;
        props = new Properties();
        props.put("bootstrap.servers", "spring-music-kafka:9092");
        props.put("acks", "all");
        props.put("retries", 0);
        props.put("batch.size", 16384);
        props.put("linger.ms", 1);
        props.put("buffer.memory", 33554432);
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        try (Producer<String, String> producer = new KafkaProducer<>(props)) {
            producer.send(new ProducerRecord<>("spring-music-kafka", album.getId(), album.toString()));
        } catch (Exception ex) {
            LOG.error("Unable to play album " + album.getId(), ex);
        }
    }
}
