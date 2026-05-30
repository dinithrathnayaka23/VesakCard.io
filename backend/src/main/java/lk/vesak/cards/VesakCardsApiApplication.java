package lk.vesak.cards;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VesakCardsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(VesakCardsApiApplication.class, args);
    }
}
