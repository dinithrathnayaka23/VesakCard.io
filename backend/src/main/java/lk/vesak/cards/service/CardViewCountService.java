package lk.vesak.cards.service;

import lk.vesak.cards.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardViewCountService {

    private final CardRepository cardRepository;

    @Async
    @Transactional
    public void incrementViewCount(String slug) {
        cardRepository.incrementViewCountBySlug(slug);
    }
}
