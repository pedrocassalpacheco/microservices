/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.soickm.streamer;

/**
 *
 * @author root
 */
import com.instana.sdk.annotation.Span;
import com.soickm.helpers.KafkaHelper;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;

public class main {

    private static final Logger LOG = Logger.getLogger(main.class.getName());
    
    public static void main(String[] args) {
         //new Thread(new ConsumerThread("localhost:9092", "test")).start();        
         KafkaHelper.InitKafka("localhost:2181", "test");
           while (true) {
            ConsumerRecords<String, String> records = KafkaHelper.GetConsumer().poll(100);

            for (ConsumerRecord<String, String> record : records) {
                LOG.log(Level.INFO, "Offset = %{0}, Key = %{1}, Value = {2}", new Object[] {record.offset(), record.key(), record.value()});
            }
        }
         
         
    }
    
    @Span(type = Span.Type.ENTRY, value = "streamer", captureArguments = true)
    private Map<String, String> runRequest(Map<String, String> request) throws InterruptedException {
        Thread.sleep(1000); // sleeping makes the resulting trace nicer
        HashMap<String, String> result = new HashMap<>();
        result.put("nap", "yes");
        return result;
    }
       
}
