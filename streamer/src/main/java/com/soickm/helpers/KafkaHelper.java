/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.soickm.helpers;

import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.log4j.BasicConfigurator;

/**
 *
 * @author root
 */
public class KafkaHelper {

    private static String topicName;
    private static KafkaConsumer<String, String> consumer;
    private static final Logger LOG = Logger.getLogger(KafkaHelper.class.getName());
    
    /**
     *
     * @param zooKeeper
     * @param topicName
     */
    public static void InitKafka(String zooKeeper, String topicName) {
        BasicConfigurator.configure();
        org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.INFO);
        
        Properties props = new Properties();
        KafkaHelper.topicName = topicName;
        props.put("bootstrap.servers", zooKeeper);
        props.put("group.id", "test");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("session.timeout.ms", "30000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        LOG.log(Level.INFO, "Creating Consumer on {0}", zooKeeper);

        consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Arrays.asList(topicName));
        
        LOG.log(Level.INFO, "Subscribed to topic {0}", topicName);
    }
    
    public static KafkaConsumer<String, String> GetConsumer() {
        return consumer;
    }
            
}
