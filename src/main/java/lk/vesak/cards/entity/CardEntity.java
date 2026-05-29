package lk.vesak.cards.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "slug", nullable = false, unique = true, length = 8)
    private String slug;

    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    @Column(name = "recipient_name", nullable = false, length = 100)
    @Builder.Default
    private String recipientName = "";

    @Column(name = "wish_text", nullable = false, columnDefinition = "TEXT")
    private String wishText;

    @Column(name = "theme", nullable = false, length = 50)
    @Builder.Default
    private String theme = "lotus_night";

    @Column(name = "border_style", nullable = false, length = 50)
    @Builder.Default
    private String borderStyle = "traditional_1";

    @Column(name = "accent_color", nullable = false, length = 7)
    @Builder.Default
    private String accentColor = "#D4AF37";

    @Column(name = "animation_set", nullable = false, length = 50)
    @Builder.Default
    private String animationSet = "lanterns_petals";

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    @Builder.Default
    private Instant expiresAt = Instant.now().plus(365, ChronoUnit.DAYS);
}
