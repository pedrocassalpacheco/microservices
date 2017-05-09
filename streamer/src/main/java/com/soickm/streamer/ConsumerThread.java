/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.soickm.streamer;

import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.log4j.BasicConfigurator;
import com.instana.sdk.annotation.Span;
import com.instana.sdk.annotation.Span.Type;
import com.instana.sdk.support.SpanSupport;

final class ConsumerThread implements Runnable {

    KafkaConsumer<String, String> consumer;
    private static final Logger LOG = Logger.getLogger(ConsumerThread.class.getName());

    String topicName;

    public ConsumerThread(String zooKeeper, String topicName) {

        BasicConfigurator.configure();
        org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.INFO);

        // Kafka consumer configuration settings
        Properties props = new Properties();
        this.topicName = topicName;
        props.put("bootstrap.servers", zooKeeper);
        props.put("group.id", "test");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("session.timeout.ms", "30000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        LOG.log(Level.INFO, "Creating Consumer on {0}", zooKeeper);

        consumer = new KafkaConsumer<>(props);

        LOG.info("Subscribing");
        consumer.subscribe(Arrays.asList(topicName));
        LOG.log(Level.INFO, "Subscribed to topic {0}", topicName);
    }

    @Override
    public void run() {
        LOG.info("Waiting on messages");

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);

            for (ConsumerRecord<String, String> record : records) {
                LOG.log(Level.INFO, "Offset = %{0}, Key = %{1}, Value = {2}", new Object[] {record.offset(), record.key(), record.value()});
            }
        }
    }

    private void correlateTracing(Map<String, String> request) {
        // it is best practice to clean up the headers so a program with agent receives the same values as a program
        // without agent would.
        String level = request.remove(SpanSupport.LEVEL);
        String trace = request.remove(SpanSupport.TRACE_ID);
        String span = request.remove(SpanSupport.SPAN_ID);

        // note that the headers need to be evaluated before the actual "Entry" span is created.
        if (SpanSupport.SUPPRESS.equals(level)) {
            SpanSupport.suppressNext();
        } else {
            if (trace != null && span != null) {
                SpanSupport.inheritNext(SpanSupport.stringAsId(trace), SpanSupport.stringAsId(span));
            }
        }
    }

    @Span(type = Type.ENTRY, value = "custom-tcp-server", captureArguments = true)
    private Map<String, String> runRequest(Map<String, String> request) throws InterruptedException {
        Thread.sleep(1000); // sleeping makes the resulting trace nicer
        HashMap<String, String> result = new HashMap<>();
        result.put("nap", "yes");
        return result;
    }

}
