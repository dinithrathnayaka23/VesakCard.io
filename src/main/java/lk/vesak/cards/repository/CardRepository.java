package lk.vesak.cards.repository;

import lk.vesak.cards.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<CardEntity, UUID> {

    boolean existsBySlug(String slug);

    Optional<CardEntity> findBySlug(String slug);

    @Modifying
    @Query("update CardEntity card set card.viewCount = card.viewCount + 1 where card.slug = :slug")
    int incrementViewCountBySlug(@Param("slug") String slug);
}
